# db models for initializing the db writer
import os
import platform

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base

BASE = declarative_base()

class RQGenWeb(BASE):
    __tablename__ = "rqgen_web"

    id = Column(Integer, primary_key=True, index=True)
    time_stamp = Column(DateTime(timezone=True), server_default=func.now())
    client_name = Column(String, default=platform.node())
    session_id = Column(String, index=True)
    type = Column(String)
    log_body = Column(String)

