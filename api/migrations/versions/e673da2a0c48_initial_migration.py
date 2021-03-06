"""Initial migration

Revision ID: e673da2a0c48
Revises: 
Create Date: 2022-03-14 09:59:52.452269

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e673da2a0c48'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=128), nullable=False),
    sa.Column('active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('eventlog_files',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('file', sa.LargeBinary(), nullable=True),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('type', sa.String(length=16), nullable=False),
    sa.Column('created_by', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('case', sa.String(length=128), nullable=True),
    sa.Column('activity', sa.String(length=128), nullable=True),
    sa.Column('timestamp', sa.String(length=128), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('discovery',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('eventlog_id', sa.Integer(), nullable=True),
    sa.Column('algorithm', sa.String(length=128), nullable=False),
    sa.Column('created_by', sa.DateTime(), nullable=True),
    sa.Column('case', sa.String(length=128), nullable=True),
    sa.Column('activity', sa.String(length=128), nullable=True),
    sa.Column('timestamp', sa.String(length=128), nullable=True),
    sa.Column('gviz', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['eventlog_id'], ['eventlog_files.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ltl_rule',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('rule', sa.String(length=128), nullable=False),
    sa.Column('source_inssurer', sa.JSON(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('eventlog_id', sa.Integer(), nullable=True),
    sa.Column('edited_at', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['eventlog_id'], ['eventlog_files.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('statistic',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('eventlog_id', sa.Integer(), nullable=False),
    sa.Column('median_case_duration', sa.Float(), nullable=True),
    sa.Column('number_of_cases', sa.Integer(), nullable=True),
    sa.Column('number_of_events', sa.Integer(), nullable=True),
    sa.Column('number_of_variants', sa.Integer(), nullable=True),
    sa.Column('handover_of_work', sa.Text(), nullable=True),
    sa.Column('rework', sa.Integer(), nullable=True),
    sa.Column('fitness', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['eventlog_id'], ['eventlog_files.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('underwritings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('customer_name', sa.String(length=128), nullable=True),
    sa.Column('customer_id', sa.Integer(), nullable=True),
    sa.Column('assessment_name', sa.String(length=128), nullable=True),
    sa.Column('assessment_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('eventlog_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['eventlog_id'], ['eventlog_files.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('policies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('insurer_name', sa.String(length=128), nullable=True),
    sa.Column('inssurer_id', sa.Integer(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('underwriting_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['underwriting_id'], ['underwritings.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('coverages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('policy_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['policy_id'], ['policies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('risks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('policy_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['policy_id'], ['policies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('confidence_factors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('coverage_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['coverage_id'], ['coverages.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('confidence_factors')
    op.drop_table('risks')
    op.drop_table('coverages')
    op.drop_table('policies')
    op.drop_table('underwritings')
    op.drop_table('statistic')
    op.drop_table('ltl_rule')
    op.drop_table('discovery')
    op.drop_table('eventlog_files')
    op.drop_table('users')
    # ### end Alembic commands ###
