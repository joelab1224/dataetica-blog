#!/bin/bash

# Security Testing Script for DataÉtica Blog API
# Tests authentication on all admin API endpoints

echo "🔐 API Security Testing - DataÉtica Blog"
echo "======================================="

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local test_name=$5
    
    echo -n "Testing $test_name... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $response)"
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $response)"
    fi
}

echo ""
echo "🧪 Testing Unauthorized Access (Should all return 401)"
echo "---------------------------------------------------"

# Test Posts API - Should all be protected
test_endpoint "POST" "/api/posts" '{"title":"Hack Test","excerpt":"Should fail","content":"Test","categoryId":"test"}' "401" "POST /api/posts (Create Post)"

test_endpoint "PUT" "/api/posts/test-id" '{"title":"Hack Update"}' "401" "PUT /api/posts/[id] (Update Post)"

test_endpoint "DELETE" "/api/posts/test-id" "" "401" "DELETE /api/posts/[id] (Delete Post)"

echo ""

# Test Categories API - Should all be protected
test_endpoint "POST" "/api/categories" '{"name":"Hack Category","description":"Should fail"}' "401" "POST /api/categories (Create Category)"

test_endpoint "PUT" "/api/categories/test-id" '{"name":"Hack Update"}' "401" "PUT /api/categories/[id] (Update Category)"

test_endpoint "DELETE" "/api/categories/test-id" "" "401" "DELETE /api/categories/[id] (Delete Category)"

echo ""
echo "🔓 Testing Public Access (Should return 200 or appropriate response)"
echo "----------------------------------------------------------------"

# Test public endpoints - Should work without auth
test_endpoint "GET" "/api/posts" "" "200" "GET /api/posts (List Posts)"

test_endpoint "GET" "/api/categories" "" "200" "GET /api/categories (List Categories)"

test_endpoint "GET" "/api/posts/non-existent" "" "404" "GET /api/posts/[id] (Get Single Post - 404 expected)"

test_endpoint "GET" "/api/categories/non-existent" "" "404" "GET /api/categories/[id] (Get Single Category - 404 expected)"

echo ""
echo "📊 Security Test Summary"
echo "======================"
echo "✅ All admin endpoints (POST/PUT/DELETE) should return 401 Unauthorized"
echo "✅ All public endpoints (GET) should work without authentication"
echo "✅ If any test fails, the API has security vulnerabilities"

echo ""
echo "🚀 To test with authentication:"
echo "1. Login to admin panel: $BASE_URL/admin/login"
echo "2. Use browser dev tools to copy the authentication cookie"
echo "3. Run authenticated tests with: curl -H 'Cookie: token=YOUR_TOKEN' ..."

echo ""
echo -e "${YELLOW}⚠️  Remember to test in production with real authentication!${NC}"
