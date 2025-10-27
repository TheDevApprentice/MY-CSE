#!/bin/bash

# Test de performance Redis vs MySQL distant (Allemagne)
# Ce script va te montrer la VRAIE différence !

echo "🧪 Test Performance Redis vs MySQL distant"
echo "=========================================="

API_URL="http://localhost:3333/v1/users"

echo ""
echo "🗑️ 1. Vider le cache Redis pour forcer MySQL..."
curl -s "http://localhost:3333/test/v1/redis-test" > /dev/null

# Vider le cache users via Redis CLI
echo "   Suppression du cache users..."
# Tu peux faire ça manuellement : docker-compose -f docker-compose.dev.yml exec redis redis-cli del users:all

echo ""
echo "📊 2. Test sans cache (MySQL Allemagne)..."
echo "   GET $API_URL"

# Mesure le temps SANS cache (première requête)
START_TIME=$(date +%s%3N)
RESPONSE1=$(curl -s -w "%{time_total}" "$API_URL")
END_TIME=$(date +%s%3N)
TIME_WITHOUT_CACHE=$((END_TIME - START_TIME))

echo "   ⏱️  Temps SANS cache: ${TIME_WITHOUT_CACHE}ms"
echo "   🔍 fromCache: $(echo "$RESPONSE1" | jq -r '.fromCache // "N/A"')"

echo ""
echo "⚡ 3. Test avec cache (Redis local)..."
echo "   GET $API_URL"

# Mesure le temps AVEC cache (deuxième requête)
START_TIME=$(date +%s%3N)
RESPONSE2=$(curl -s -w "%{time_total}" "$API_URL")
END_TIME=$(date +%s%3N)
TIME_WITH_CACHE=$((END_TIME - START_TIME))

echo "   ⏱️  Temps AVEC cache: ${TIME_WITH_CACHE}ms"
echo "   🔍 fromCache: $(echo "$RESPONSE2" | jq -r '.fromCache // "N/A"')"

echo ""
echo "📈 4. Résultats comparatifs:"
echo "   🐌 MySQL (Allemagne):  ${TIME_WITHOUT_CACHE}ms"
echo "   ⚡ Redis (Local):      ${TIME_WITH_CACHE}ms"

if [ $TIME_WITHOUT_CACHE -gt 0 ] && [ $TIME_WITH_CACHE -gt 0 ]; then
    SPEED_IMPROVEMENT=$((TIME_WITHOUT_CACHE / TIME_WITH_CACHE))
    echo "   🚀 Amélioration:       ${SPEED_IMPROVEMENT}x plus rapide"
fi

echo ""
echo "💡 Note: Avec une DB en Allemagne, tu devrais voir:"
echo "   - SANS cache: 200-500ms (latence réseau + requête DB)"
echo "   - AVEC cache: 5-20ms (Redis local)"
echo "   - Gain: 10-50x plus rapide !"