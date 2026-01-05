#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           PromptVault Environment Setup Helper                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to update .env file
update_env() {
    key=$1
    value=$2
    if grep -q "^${key}=" .env; then
        # Update existing key
        sed -i.bak "s|^${key}=.*|${key}=\"${value}\"|" .env && rm .env.bak 2>/dev/null || sed -i '' "s|^${key}=.*|${key}=\"${value}\"|" .env
    else
        # Add new key
        echo "${key}=\"${value}\"" >> .env
    fi
    echo -e "${GREEN}✓${NC} Updated ${key}"
}

# Check current .env status
echo -e "${YELLOW}Checking your current .env configuration...${NC}"
echo ""

if grep -q "^DATABASE_URL=\"postgresql://user:password@" .env; then
    echo "❌ DATABASE_URL - Not configured (using placeholder)"
else
    echo "✅ DATABASE_URL - Configured"
fi

if grep -q "^GITHUB_ID=\"\"" .env; then
    echo "❌ GITHUB_ID - Not configured"
else
    echo "✅ GITHUB_ID - Configured"
fi

if grep -q "^GITHUB_SECRET=\"\"" .env; then
    echo "❌ GITHUB_SECRET - Not configured"
else
    echo "✅ GITHUB_SECRET - Configured"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "To update a value, run:"
echo -e "  ${GREEN}./setup-env.sh DATABASE_URL 'your-database-url'${NC}"
echo -e "  ${GREEN}./setup-env.sh GITHUB_ID 'your-github-id'${NC}"
echo -e "  ${GREEN}./setup-env.sh GITHUB_SECRET 'your-github-secret'${NC}"
echo ""
echo "Or edit .env directly in your editor:"
echo -e "  ${GREEN}nano .env${NC}"
echo ""

# If arguments provided, update the value
if [ $# -eq 2 ]; then
    update_env "$1" "$2"
    echo ""
    echo -e "${GREEN}Environment variable updated!${NC}"
fi
