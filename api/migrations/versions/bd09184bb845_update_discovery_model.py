"""update Discovery model

Revision ID: bd09184bb845
Revises: 3467256f469b
Create Date: 2022-03-16 20:11:36.915279

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'bd09184bb845'
down_revision = '3467256f469b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('discovery', sa.Column('file', sa.LargeBinary(), nullable=False))
    op.add_column('discovery', sa.Column('file_name', sa.String(length=128), nullable=False))
    op.add_column('discovery', sa.Column('file_type', sa.String(length=16), nullable=False))
    op.add_column('discovery', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('discovery', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.drop_column('discovery', 'created_by')
    op.drop_column('discovery', 'gviz')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('discovery', sa.Column('gviz', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('discovery', sa.Column('created_by', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('discovery', 'updated_at')
    op.drop_column('discovery', 'created_at')
    op.drop_column('discovery', 'file_type')
    op.drop_column('discovery', 'file_name')
    op.drop_column('discovery', 'file')
    # ### end Alembic commands ###
