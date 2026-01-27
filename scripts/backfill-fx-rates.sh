#!/bin/bash

# ============================================
# FX RATES BACKFILL SCRIPT
# ============================================
# This script backfills historical exchange rates for the last 12 months
# by calling the Supabase Edge Function for each month
# ============================================

set -e # Exit on error

# Configuration
SUPABASE_URL="${SUPABASE_URL:-https://your-project.supabase.co}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-your-anon-key}"
MONTHS_TO_BACKFILL=12
RATE_LIMIT_DELAY=2 # Seconds between requests

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== FX Rates Backfill Script ===${NC}"
echo "Supabase URL: $SUPABASE_URL"
echo "Backfilling last $MONTHS_TO_BACKFILL months"
echo ""

# Check if required environment variables are set
if [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
  echo -e "${RED}Error: SUPABASE_URL not set${NC}"
  echo "Usage: SUPABASE_URL=https://your-project.supabase.co SUPABASE_ANON_KEY=your-key ./backfill-fx-rates.sh"
  exit 1
fi

if [ "$SUPABASE_ANON_KEY" = "your-anon-key" ]; then
  echo -e "${RED}Error: SUPABASE_ANON_KEY not set${NC}"
  echo "Usage: SUPABASE_URL=https://your-project.supabase.co SUPABASE_ANON_KEY=your-key ./backfill-fx-rates.sh"
  exit 1
fi

# Function to get first day of month N months ago
get_month() {
  local months_ago=$1
  
  # macOS and Linux have different date command syntax
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    date -v-${months_ago}m +%Y-%m-01
  else
    # Linux
    date -d "$months_ago months ago" +%Y-%m-01
  fi
}

# Backfill loop
success_count=0
error_count=0

for i in $(seq 1 $MONTHS_TO_BACKFILL); do
  month=$(get_month $i)
  
  echo -e "${YELLOW}Fetching rates for: $month${NC}"
  
  # Call Edge Function
  response=$(curl -s -w "\n%{http_code}" -X POST \
    "${SUPABASE_URL}/functions/v1/fetch-fx-rates" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"month\": \"$month\"}")
  
  # Extract HTTP status code (last line)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Success: $month${NC}"
    echo "  Response: $body"
    ((success_count++))
  else
    echo -e "${RED}✗ Failed: $month (HTTP $http_code)${NC}"
    echo "  Response: $body"
    ((error_count++))
  fi
  
  # Rate limiting delay (except for last iteration)
  if [ $i -lt $MONTHS_TO_BACKFILL ]; then
    echo "  Waiting ${RATE_LIMIT_DELAY}s..."
    sleep $RATE_LIMIT_DELAY
  fi
  
  echo ""
done

# Summary
echo -e "${GREEN}=== Backfill Complete ===${NC}"
echo "Success: $success_count"
echo "Errors: $error_count"

if [ $error_count -gt 0 ]; then
  exit 1
fi
