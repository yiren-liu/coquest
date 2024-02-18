# Description: postgres DB Client.

import os
import time
from typing import Any, Dict, List
import json

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import boto3

from autogpt.config.singleton import Singleton
from autogpt.db_utils.models import BASE, RQGenWeb

user = os.environ["RQGEN_DB_USER"]
password = os.environ["RQGEN_DB_PASS"]
host = os.environ["RQGEN_DB_HOST"]
port = os.environ["RQGEN_DB_PORT"]
# database = os.environ["RQGEN_DB_NAME"]

SQLALCHEMY_DATABASE_URL = f"postgresql://{user}:{password}@{host}:{port}"

class RDSClient(metaclass=Singleton):
    """
    DB Client.
    """

    def __init__(self) -> None:
        print("Initializing DB Client...")
        start = time.time()

        self.engine = create_engine(SQLALCHEMY_DATABASE_URL)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

        end = time.time()
        print(f"DB Client initialized in {end - start} seconds.")

        # if table does not exist, create it
        if not self.engine.dialect.has_table(self.engine.connect(), "rqgen_web"):
            BASE.metadata.create_all(bind=self.engine)

    def get_session(self):
        return self.SessionLocal()
    
    def write_log(self, session_id: str, type: str, log_body: dict):
        db_rqgen_web = RQGenWeb(session_id=session_id, type=type, log_body=json.dumps(log_body))
        db = self.get_session()
        try:
            db.add(db_rqgen_web)
            db.commit()
            db.refresh(db_rqgen_web)
        except Exception as e:
            print("Error when writing log to database." + str(e))
            db.rollback()
        finally:
            db.close()
        return db_rqgen_web
