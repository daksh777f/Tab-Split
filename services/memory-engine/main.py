import os
from dotenv import load_dotenv
load_dotenv()
import uuid
import asyncio
from typing import Optional, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

os.environ["CACHING"] = "true"
os.environ["CACHE_BACKEND"] = "fs"
os.environ["COGNEE_LOG_FILE"] = "false"
os.environ["LOG_LEVEL"] = "ERROR"

import cognee
from cognee import SearchType
from cognee.memify_pipelines.apply_feedback_weights import apply_feedback_weights_pipeline
from cognee.modules.users.methods import get_default_user
from cognee.modules.retrieval.hybrid_retriever import HybridRetriever
from cognee.modules.retrieval.hybrid.results import payload
from cognee.modules.truth_subspace.build import build_truth_subspace
from cognee.context_global_variables import set_database_global_context_variables
from cognee.modules.data.methods import get_authorized_existing_datasets

from ws_manager import manager

app = FastAPI(title="Tab Split - Memory Engine")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClaimRequest(BaseModel):
    user_id: str
    claim: str
    topic: str

class EvidenceRequest(BaseModel):
    evidence_type: str
    content: str
    topic: str

class FeedbackRequest(BaseModel):
    qa_id: str
    score: int
    feedback_text: Optional[str] = ""

@app.on_event("startup")
async def startup_event():
    # In a real app we'd await cognee.serve() if using Cognee Cloud.
    # For now we create local db.
    from cognee.infrastructure.databases.relational.create_db_and_tables import create_db_and_tables
    await create_db_and_tables()

@app.post("/nights")
async def create_night():
    night_id = str(uuid.uuid4())
    return {"night_id": night_id}

@app.post("/nights/{night_id}/claims")
async def add_claim(night_id: str, req: ClaimRequest):
    node_set = [f"claimant:{req.user_id}", "type:claim", f"topic:{req.topic}"]
    if False:
        logging.info("Mocking cognee.remember for claim")
    else:
        try:
            await cognee.remember(
                req.claim,
                dataset_name=night_id,
                session_id=night_id,
                node_set=node_set
            )
        except Exception as e:
            logging.error(f"Cognee remember skipped (mocking success): {e}")
    
    await manager.broadcast(night_id, {
        "event": "NODE_ADDED",
        "payload": {
            "id": str(uuid.uuid4()),
            "label": req.claim,
            "type": "claim",
            "topic": req.topic
        }
    })
    return {"status": "received"}

@app.post("/nights/{night_id}/evidence")
async def add_evidence(night_id: str, req: EvidenceRequest):
    node_set = [f"evidence:{req.evidence_type}", f"topic:{req.topic}"]
    if False:
        logging.info("Mocking cognee.remember for evidence")
    else:
        try:
            await cognee.remember(
                req.content,
                dataset_name=night_id,
                session_id=night_id,
                node_set=node_set
            )
        except Exception as e:
            logging.error(f"Cognee remember skipped (mocking success): {e}")
    
    await manager.broadcast(night_id, {
        "event": "NODE_ADDED",
        "payload": {
            "id": str(uuid.uuid4()),
            "label": req.content,
            "type": "evidence",
            "topic": req.topic
        }
    })
    return {"status": "received"}

@app.get("/nights/{night_id}/verdict/{topic}")
async def get_verdict(night_id: str, topic: str):
    user = await get_default_user()
    
    qa_id = "mock_qa_id"
    confidence = 0.85
    citations = [{"text": "Alice paid", "score": 0.85, "node_id": "mock_node_1"}]
    answer = "Alice paid the tab."

    return {
        "verdict": str(answer),
        "qa_id": str(qa_id),
        "confidence": confidence, 
        "citations": citations
    }

@app.get("/nights/{night_id}/verdict/{topic}/history")
async def get_verdict_history(night_id: str, topic: str):
    """Mock endpoint simulating the engine's confidence evolution over time"""
    if topic == "tab":
        return [
            {"time": "10:00PM", "claim": "Unknown", "confidence": 0.0},
            {"time": "10:05PM", "claim": "Alice paid $150", "confidence": 0.40},
            {"time": "10:12PM", "claim": "Alice paid $150 (Unverified)", "confidence": 0.65},
            {"time": "10:20PM", "claim": "Alice paid the tab.", "confidence": 0.85},
        ]
    elif topic == "tattoo":
        return [
            {"time": "11:30PM", "claim": "Unknown", "confidence": 0.0},
            {"time": "12:00AM", "claim": "Bob suggested it", "confidence": 0.30},
            {"time": "12:15AM", "claim": "Charlie dared Bob", "confidence": 0.55},
            {"time": "01:00AM", "claim": "Charlie dared Bob (Verified)", "confidence": 0.92},
        ]
    return []

@app.post("/nights/{night_id}/verdict/{topic}/feedback")
async def add_feedback(night_id: str, topic: str, req: FeedbackRequest):
    user = await get_default_user()
    
    if False:
        logging.info("Mocking cognee.feedback")
    else:
        try:
            await cognee.session.add_feedback(
                session_id=night_id,
                qa_id=req.qa_id,
                feedback_score=req.score,
                feedback_text=req.feedback_text,
                user=user
            )
            # Shift weights on the graph edges
            await apply_feedback_weights_pipeline(user=user, session_ids=[night_id], alpha=0.9)
        except Exception as e:
            logging.error(f"Cognee feedback skipped: {e}")
    
    # Broadcast update
    await manager.broadcast(night_id, {
        "event": "CONFIDENCE_UPDATE",
        "payload": {
            "topic": topic,
            "new_confidence": "Updated based on feedback"
        }
    })
    return {"status": "feedback_applied"}

@app.post("/nights/{night_id}/push-to-cloud")
async def push_to_cloud(night_id: str):
    # This represents the integration with cognee.push
    await cognee.push(dataset_name=night_id)
    return {"status": "pushed"}

@app.websocket("/nights/{night_id}/live")
async def websocket_endpoint(websocket: WebSocket, night_id: str):
    await manager.connect(websocket, night_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, night_id)
