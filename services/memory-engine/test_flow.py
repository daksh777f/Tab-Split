import httpx
import time
import json
import logging

logging.basicConfig(level=logging.INFO)

API_URL = "http://127.0.0.1:8000"
TOPIC = "tab_payment"

def main():
    with httpx.Client(timeout=120.0) as client:
        # 1. Create a night
        logging.info("Creating a night session...")
        res = client.post(f"{API_URL}/nights")
        res.raise_for_status()
        night_id = res.json()["night_id"]
        logging.info(f"Night created: {night_id}")

        # 2. Submit conflicting claims
        logging.info("Submitting claim 1 (Alice paid)...")
        client.post(f"{API_URL}/nights/{night_id}/claims", json={
            "user_id": "alice",
            "claim": "I paid the tab of 150 dollars.",
            "topic": TOPIC
        })
        time.sleep(1)

        logging.info("Submitting claim 2 (Bob paid)...")
        client.post(f"{API_URL}/nights/{night_id}/claims", json={
            "user_id": "bob",
            "claim": "I am the one who paid the tab, it was me.",
            "topic": TOPIC
        })
        time.sleep(1)

        # 3. Submit evidence
        logging.info("Submitting evidence supporting Alice...")
        client.post(f"{API_URL}/nights/{night_id}/evidence", json={
            "evidence_type": "receipt_screenshot",
            "content": "Receipt showing card ending in 1234 (Alice's card) charged 150 dollars.",
            "topic": TOPIC
        })
        time.sleep(1)

        # 4. Get Verdict
        logging.info("Retrieving verdict... This will run Cognee improve and recall...")
        res = client.get(f"{API_URL}/nights/{night_id}/verdict/{TOPIC}")
        verdict_data = res.json()
        logging.info(f"Verdict Response: {json.dumps(verdict_data, indent=2)}")
        
        qa_id = verdict_data.get("qa_id")
        confidence_before = verdict_data.get("confidence")

        if not qa_id:
            logging.warning("No valid qa_id returned. Skipping feedback step.")
            return

        # 5. Submit negative feedback
        logging.info(f"Submitting negative feedback (score 1) for qa_id: {qa_id}...")
        client.post(f"{API_URL}/nights/{night_id}/verdict/{TOPIC}/feedback", json={
            "qa_id": qa_id,
            "score": 1,
            "feedback_text": "This verdict is completely wrong, Bob actually paid!"
        })
        time.sleep(2)

        # 6. Re-evaluate Verdict
        logging.info("Retrieving verdict after feedback...")
        res = client.get(f"{API_URL}/nights/{night_id}/verdict/{TOPIC}")
        new_verdict_data = res.json()
        logging.info(f"New Verdict Response: {json.dumps(new_verdict_data, indent=2)}")
        
        confidence_after = new_verdict_data.get("confidence")
        logging.info(f"Confidence Shift: {confidence_before} -> {confidence_after}")

if __name__ == "__main__":
    main()
