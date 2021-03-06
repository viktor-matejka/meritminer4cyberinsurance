"""add profile to Eventlog

Revision ID: 68ff0b272263
Revises: 2a908ddef9bd
Create Date: 2022-03-19 13:05:25.278911

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '68ff0b272263'
down_revision = '2a908ddef9bd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('eventlog_files', sa.Column('profile_id', sa.Integer(), nullable=True))
    op.create_foreign_key('eventlog_files_profile_id_fkey', 'eventlog_files', 'profile', ['profile_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('eventlog_files_profile_id_fkey', 'eventlog_files', type_='foreignkey')
    op.drop_column('eventlog_files', 'profile_id')
    # ### end Alembic commands ###
