import os
import sys
from dotenv import load_dotenv
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config
from sqlalchemy import pool

from realtime_ai_character.database.base import Base  # import the Base model
# dummy import to support alembic revision --autogenerate
from realtime_ai_character.models.character import Character
from realtime_ai_character.models.feedback import Feedback
from realtime_ai_character.models.interaction import Interaction
from realtime_ai_character.models.memory import Memory
from realtime_ai_character.models.quivr_info import QuivrInfo
from realtime_ai_character.models.user import User


load_dotenv()

# Add the project root to the system path
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root)

# import your model here

# this is the Alembic Config object, which provides access to the values
# within the .ini file in use.
config = context.config
database_url = os.getenv('DATABASE_URL') if os.getenv(
    'DATABASE_URL') else 'sqlite:///./init_db.sqlite'
config.set_main_option('sqlalchemy.url', database_url)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata  # use your Base metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
