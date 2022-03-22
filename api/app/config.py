import os
from typing import List, Type

basedir = os.path.abspath(os.path.dirname(__file__))

class BaseConfig:
    CONFIG_NAME = "base"
    USE_MOCK_EQUIVALENCY = False
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    CONFIG_NAME = "dev"
    SECRET_KEY = os.getenv(
        "DEV_SECRET_KEY", "You can't see California without Marlon Widgeto's eyes"
    )
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRESQL_URL", "postgresql://admin:password@db:5432/prototype")
    # RESTX_MASK_HEADER = None
    RESTX_MASK_SWAGGER = None


class TestingConfig(BaseConfig):
    CONFIG_NAME = "test"
    SECRET_KEY = os.getenv("TEST_SECRET_KEY", "Thanos did nothing wrong")
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRESQL_URL", "postgresql://admin:password@db:5432/prototype")


class ProductionConfig(BaseConfig):
    CONFIG_NAME = "prod"
    SECRET_KEY = os.getenv("PROD_SECRET_KEY", "I'm Ron Burgundy?")
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRESQL_URL", "postgresql://admin:password@db:5432/prototype")


EXPORT_CONFIGS: List[Type[BaseConfig]] = [
    DevelopmentConfig,
    TestingConfig,
    ProductionConfig,
]
config_by_name = {cfg.CONFIG_NAME: cfg for cfg in EXPORT_CONFIGS}

LOGGING = {
      'handlers': {
          'console': {
              'level': 'DEBUG',
              'class': 'logging.StreamHandler',
          },
      },
      'loggers': {
          'werkzeug': {
              'handlers': ['console'],
              'level': 'DEBUG',
              'propagate': True,
          },
      },
  }