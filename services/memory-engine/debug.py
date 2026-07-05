import asyncio
import os
import uuid

os.environ["CACHING"] = "true"
os.environ["CACHE_BACKEND"] = "fs"
os.environ["COGNEE_LOG_FILE"] = "false"
os.environ["LOG_LEVEL"] = "ERROR"

import cognee

async def main():
    from cognee.infrastructure.databases.relational.create_db_and_tables import create_db_and_tables
    await create_db_and_tables()

    night_id = str(uuid.uuid4())
    print("Night ID:", night_id)
    node_set = ["claimant:alice", "type:claim", "topic:tab_payment"]
    print("Adding claim...")
    try:
        await cognee.remember(
            "I paid the tab of 150 dollars.",
            dataset_name=night_id,
            session_id=night_id,
            node_set=node_set
        )
        print("Success")
    except Exception as e:
        print("Exception:", e)

asyncio.run(main())
