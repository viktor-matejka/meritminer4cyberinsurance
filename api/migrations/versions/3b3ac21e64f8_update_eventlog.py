"""update eventlog

Revision ID: 3b3ac21e64f8
Revises: 52f3216387ad
Create Date: 2022-03-15 17:18:34.751742

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3b3ac21e64f8'
down_revision = '52f3216387ad'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('eventlog_files', sa.Column('title', sa.String(length=128), nullable=False))
    op.add_column('eventlog_files', sa.Column('file_name', sa.String(length=128), nullable=False))
    op.add_column('eventlog_files', sa.Column('file_type', sa.String(length=16), nullable=False))
    op.add_column('eventlog_files', sa.Column('profile_id', sa.Integer(), nullable=True))
    op.add_column('eventlog_files', sa.Column('is_uploaded', sa.Boolean(), nullable=False))
    op.add_column('eventlog_files', sa.Column('edited_at', sa.DateTime(), nullable=True))
    op.add_column('eventlog_files', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.drop_constraint('eventlog_files_user_id_fkey', 'eventlog_files', type_='foreignkey')
    op.create_foreign_key('eventlog_files_user_id_fkey', 'eventlog_files', 'profile', ['profile_id'], ['id'])
    op.drop_column('eventlog_files', 'user_id')
    op.drop_column('eventlog_files', 'type')
    op.drop_column('eventlog_files', 'name')
    op.drop_column('eventlog_files', 'created_by')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('eventlog_files', sa.Column('created_by', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('eventlog_files', sa.Column('name', sa.VARCHAR(length=128), autoincrement=False, nullable=False))
    op.add_column('eventlog_files', sa.Column('type', sa.VARCHAR(length=16), autoincrement=False, nullable=False))
    op.add_column('eventlog_files', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint('eventlog_files_user_id_fkey', 'eventlog_files', type_='foreignkey')
    op.create_foreign_key('eventlog_files_user_id_fkey', 'eventlog_files', 'users', ['user_id'], ['id'])
    op.drop_column('eventlog_files', 'created_at')
    op.drop_column('eventlog_files', 'edited_at')
    op.drop_column('eventlog_files', 'is_uploaded')
    op.drop_column('eventlog_files', 'profile_id')
    op.drop_column('eventlog_files', 'file_type')
    op.drop_column('eventlog_files', 'file_name')
    op.drop_column('eventlog_files', 'title')
    # ### end Alembic commands ###
