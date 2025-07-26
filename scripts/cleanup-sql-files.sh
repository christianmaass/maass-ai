#!/bin/bash

# =====================================================
# SQL FILES CLEANUP SCRIPT
# =====================================================
# This script removes obsolete analysis/debug SQL files
# and keeps only the production-relevant ones
#
# SAFE: Creates backup before deletion
# =====================================================

echo "🧹 Starting SQL files cleanup..."

# Create backup directory
mkdir -p sql-backup-$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="sql-backup-$(date +%Y%m%d-%H%M%S)"

echo "📦 Creating backup in $BACKUP_DIR..."

# Files to KEEP (production important)
KEEP_FILES=(
    "DEFINITIVE_CLEAN_SCHEMA.sql"
    "CREATE_MISSING_VIEW.sql" 
    "RESTORE_TEST_USER.sql"
    "database/schema.sql"
    "database/seed-data.sql"
    "database/tariff-schema.sql"
    "database/tariff-seed-data.sql"
)

# Files to DELETE (obsolete analysis scripts)
DELETE_FILES=(
    "ARBEITSPAKET_1_SCHEMA_AUDIT.sql"
    "ARBEITSPAKET_2_USER_PROFILES_FIX.sql"
    "ARBEITSPAKET_3_USER_TARIFF_VIEW.sql"
    "ARBEITSPAKET_4_FINALE_VERIFIKATION.sql"
    "ARBEITSPAKET_4_FINAL_TEST.sql"
    "CHECK_ASSESSMENTS_SCHEMA.sql"
    "CLEAN_SESSION_FIX.sql"
    "DEEP_ASSESSMENTS_DIAGNOSIS.sql"
    "DEFINITIVE_DATABASE_MIGRATION.sql"
    "DEFINITIVE_DATABASE_MIGRATION_CORRECTED.sql"
    "FINAL_SAFE_MIGRATION.sql"
    "FIX_ASSESSMENTS_PERMISSIONS.sql"
    "FIX_ASSESSMENTS_RLS.sql"
    "FIX_RLS_INFINITE_RECURSION.sql"
    "FORCE_ASSESSMENTS_PERMISSIONS.sql"
    "QUERY_1_USER_PROFILES.sql"
    "QUERY_2_TABLES_CHECK.sql"
    "QUERY_3_TARIFF_PLANS.sql"
    "RADICAL_ASSESSMENTS_FIX.sql"
    "RADICAL_RLS_FIX.sql"
    "SESSION_CLEANUP.sql"
    "SIMPLE_ASSESSMENTS_CHECK.sql"
    "SIMPLE_TEST_1.sql"
    "SIMPLE_TEST_2.sql"
    "SIMPLE_TEST_3.sql"
    "TEST_ASSESSMENTS_ACCESS.sql"
    "database/EXECUTE_THIS.sql"
    "database/SAFE_MIGRATION.sql"
    "database/check-existing-tables.sql"
    "database/create-missing-tables.sql"
    "database/fix-cases-table.sql"
    "database/insert-case-types.sql"
)

# Backup files before deletion
echo "📋 Backing up files to be deleted..."
for file in "${DELETE_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/" 2>/dev/null || echo "  ⚠️  Could not backup $file"
    fi
done

# Delete obsolete files
echo "🗑️  Deleting obsolete analysis files..."
deleted_count=0
for file in "${DELETE_FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  ✅ Deleted: $file"
        ((deleted_count++))
    fi
done

# Show summary
echo ""
echo "🎉 Cleanup completed!"
echo "   📊 Files deleted: $deleted_count"
echo "   📦 Backup created: $BACKUP_DIR"
echo ""
echo "✅ Remaining production files:"
for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   📄 $file"
    fi
done

echo ""
echo "🚀 Project is now clean and production-ready!"
echo "   If you need any deleted files, check the backup directory."
