import logging
from typing import Dict, List, Optional
from config import MONGODB_URI, DB_NAME

logger = logging.getLogger(__name__)

# Simple In-Memory DB Fallback
class InMemoryDB:
    def __init__(self):
        self.products: Dict[str, dict] = {}
        self.inspections: Dict[str, dict] = {}
        self.users: Dict[str, dict] = {
            "usr_1": {"user_id": "usr_1", "name": "Enforcement Officer", "role": "INSPECTOR"},
            "usr_2": {"user_id": "usr_2", "name": "Legal Administrator", "role": "ADMIN"}
        }

    def save_product(self, product_data: dict):
        pid = product_data.get("product_id")
        if pid:
            self.products[pid] = product_data
        return product_data

    def save_inspection(self, inspection_data: dict):
        iid = inspection_data.get("id") or inspection_data.get("inspection_id")
        if iid:
            self.inspections[iid] = inspection_data
        return inspection_data

    def get_inspection(self, inspection_id: str) -> Optional[dict]:
        return self.inspections.get(inspection_id)

    def get_all_inspections(self) -> List[dict]:
        return list(self.inspections.values())

in_memory_db = InMemoryDB()

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.use_mongo = False

    async def connect(self):
        if MONGODB_URI:
            try:
                from motor.motor_asyncio import AsyncIOMotorClient
                self.client = AsyncIOMotorClient(MONGODB_URI)
                self.db = self.client[DB_NAME]
                # Test connection
                await self.client.admin.command('ping')
                self.use_mongo = True
                logger.info("Connected to MongoDB successfully.")
            except Exception as e:
                logger.warning(f"MongoDB connection failed: {e}. Falling back to in-memory store.")
                self.use_mongo = False
        else:
            logger.info("No MONGODB_URI provided. Operating in-memory mode.")

    async def save_inspection(self, record: dict):
        if self.use_mongo and self.db is not None:
            await self.db.inspections.update_one(
                {"id": record["id"]}, {"$set": record}, upsert=True
            )
        in_memory_db.save_inspection(record)
        return record

    async def get_inspection(self, inspection_id: str) -> Optional[dict]:
        if self.use_mongo and self.db is not None:
            doc = await self.db.inspections.find_one({"id": inspection_id})
            if doc:
                doc.pop("_id", None)
                return doc
        return in_memory_db.get_inspection(inspection_id)

    async def get_all_inspections(self) -> List[dict]:
        if self.use_mongo and self.db is not None:
            cursor = self.db.inspections.find({})
            docs = await cursor.to_list(length=500)
            for d in docs:
                d.pop("_id", None)
            if docs:
                return docs
        return in_memory_db.get_all_inspections()

db_manager = DatabaseManager()
