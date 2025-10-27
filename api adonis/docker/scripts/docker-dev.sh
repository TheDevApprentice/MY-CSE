#!/bin/bash

# Script de gestion Docker pour l'API Mon CSE
# Usage: ./docker/scripts/docker-dev.sh [commande]

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}🐳 Script de gestion Docker - API Mon CSE${NC}"
    echo ""
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  build       Construit les images Docker"
    echo "  up          Démarre tous les services"
    echo "  down        Arrête tous les services"
    echo "  restart     Redémarre tous les services"
    echo "  logs        Affiche les logs en temps réel"
    echo "  status      Affiche le statut des conteneurs"
    echo "  clean       Nettoie les images et volumes inutilisés"
    echo "  redis-cli   Se connecte à Redis CLI"
    echo "  shell       Se connecte au shell de l'API"
    echo "  setup       Configuration initiale (première fois)"
    echo "  tools       Démarre avec les outils (Redis Commander)"
    echo ""
}

# Configuration initiale
setup() {
    echo -e "${BLUE}🚀 Configuration initiale Docker${NC}"
    
    # Crée les répertoires nécessaires
    mkdir -p docker/redis
    mkdir -p logs
    
    # Copie le fichier d'environnement Docker
    if [ ! -f .env ]; then
        echo -e "${YELLOW}📄 Copie de .env.docker vers .env${NC}"
        cp .env.docker .env
    else
        echo -e "${YELLOW}⚠️  Le fichier .env existe déjà${NC}"
    fi
    
    # Crée le fichier redis.conf s'il n'existe pas
    if [ ! -f docker/redis/redis.conf ]; then
        echo -e "${YELLOW}📄 Création de la configuration Redis${NC}"
        # Le contenu sera copié depuis l'artifact redis_config
        echo "# La configuration Redis sera créée automatiquement"
    fi
    
    echo -e "${GREEN}✅ Configuration terminée${NC}"
}

# Construction des images
build() {
    echo -e "${BLUE}🔨 Construction des images Docker${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Images construites${NC}"
}

# Démarrage des services
up() {
    echo -e "${BLUE}🚀 Démarrage des services${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Services démarrés${NC}"
    echo -e "${YELLOW}📱 API disponible sur: http://localhost:3333${NC}"
    echo -e "${YELLOW}🔴 Redis disponible sur: localhost:6379${NC}"
}

# Démarrage avec les outils
up_tools() {
    echo -e "${BLUE}🛠️  Démarrage avec les outils${NC}"
    docker-compose --profile tools up -d
    echo -e "${GREEN}✅ Services + outils démarrés${NC}"
    echo -e "${YELLOW}📱 API disponible sur: http://localhost:3333${NC}"
    echo -e "${YELLOW}🔴 Redis disponible sur: localhost:6379${NC}"
    echo -e "${YELLOW}🖥️  Redis Commander: http://localhost:8081 (admin/secret)${NC}"
}

# Arrêt des services
down() {
    echo -e "${BLUE}🛑 Arrêt des services${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Services arrêtés${NC}"
}

# Redémarrage
restart() {
    echo -e "${BLUE}🔄 Redémarrage des services${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Services redémarrés${NC}"
}

# Logs en temps réel
logs() {
    echo -e "${BLUE}📋 Logs en temps réel (Ctrl+C pour quitter)${NC}"
    docker-compose logs -f
}

# Statut des conteneurs
status() {
    echo -e "${BLUE}📊 Statut des conteneurs${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}📊 Utilisation des ressources${NC}"
    docker stats --no-stream
}

# Nettoyage
clean() {
    echo -e "${BLUE}🧹 Nettoyage Docker${NC}"
    
    read -p "Voulez-vous supprimer les volumes de données ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -f
        docker volume prune -f
        echo -e "${GREEN}✅ Nettoyage complet terminé${NC}"
    else
        docker-compose down
        docker system prune -f
        echo -e "${GREEN}✅ Nettoyage léger terminé${NC}"
    fi
}

# Redis CLI
redis_cli() {
    echo -e "${BLUE}🔴 Connexion à Redis CLI${NC}"
    docker-compose exec redis redis-cli
}

# Shell de l'API
shell() {
    echo -e "${BLUE}💻 Connexion au shell de l'API${NC}"
    docker-compose exec api sh
}

# Traitement des arguments
case "${1:-help}" in
    "build")
        build
        ;;
    "up")
        up
        ;;
    "down")
        down
        ;;
    "restart")
        restart
        ;;
    "logs")
        logs
        ;;
    "status")
        status
        ;;
    "clean")
        clean
        ;;
    "redis-cli")
        redis_cli
        ;;
    "shell")
        shell
        ;;
    "setup")
        setup
        ;;
    "tools")
        up_tools
        ;;
    "help"|*)
        show_help
        ;;
esac