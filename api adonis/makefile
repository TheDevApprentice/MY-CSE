# Makefile pour l'API Mon CSE avec Docker
.PHONY: help setup build up down restart logs status clean redis-cli shell tools

# Couleurs pour l'affichage
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m

# Variables
COMPOSE_FILE=docker-compose.yml
PROJECT_NAME=cse-api

help: ## Affiche cette aide
	@echo "$(BLUE)🐳 Commandes Docker disponibles pour l'API Mon CSE$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

setup: ## Configuration initiale du projet Docker
	@echo "$(BLUE)🚀 Configuration initiale...$(NC)"
	@mkdir -p docker/redis logs
	@if [ ! -f .env ]; then cp .env.docker .env && echo "$(GREEN)✅ Fichier .env créé$(NC)"; else echo "$(YELLOW)⚠️  .env existe déjà$(NC)"; fi
	@chmod +x docker/scripts/docker-dev.sh
	@echo "$(GREEN)✅ Configuration terminée$(NC)"

build: ## Construit les images Docker
	@echo "$(BLUE)🔨 Construction des images...$(NC)"
	@docker-compose build --no-cache
	@echo "$(GREEN)✅ Images construites$(NC)"

up: ## Démarre tous les services
	@echo "$(BLUE)🚀 Démarrage des services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Services démarrés$(NC)"
	@echo "$(YELLOW)📱 API: http://localhost:3333$(NC)"
	@echo "$(YELLOW)🔴 Redis: localhost:6379$(NC)"

down: ## Arrête tous les services
	@echo "$(BLUE)🛑 Arrêt des services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Services arrêtés$(NC)"

restart: ## Redémarre tous les services
	@echo "$(BLUE)🔄 Redémarrage...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✅ Services redémarrés$(NC)"

logs: ## Affiche les logs en temps réel
	@echo "$(BLUE)📋 Logs en temps réel (Ctrl+C pour quitter)$(NC)"
	@docker-compose logs -f

status: ## Affiche le statut des conteneurs
	@echo "$(BLUE)📊 Statut des conteneurs$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)📊 Utilisation des ressources$(NC)"
	@docker stats --no-stream

clean: ## Nettoie les ressources Docker inutilisées
	@echo "$(BLUE)🧹 Nettoyage Docker...$(NC)"
	@docker-compose down
	@docker system prune -f
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

clean-all: ## Nettoie tout y compris les volumes
	@echo "$(BLUE)🧹 Nettoyage complet...$(NC)"
	@docker-compose down -v
	@docker system prune -af
	@docker volume prune -f
	@echo "$(GREEN)✅ Nettoyage complet terminé$(NC)"

redis-cli: ## Se connecte à Redis CLI
	@echo "$(BLUE)🔴 Connexion à Redis CLI$(NC)"
	@docker-compose exec redis redis-cli

shell: ## Se connecte au shell de l'API
	@echo "$(BLUE)💻 Shell de l'API$(NC)"
	@docker-compose exec api sh

tools: ## Démarre avec Redis Commander
	@echo "$(BLUE)🛠️  Démarrage avec outils...$(NC)"
	@docker-compose --profile tools up -d
	@echo "$(GREEN)✅ Services + outils démarrés$(NC)"
	@echo "$(YELLOW)📱 API: http://localhost:3333$(NC)"
	@echo "$(YELLOW)🔴 Redis: localhost:6379$(NC)"
	@echo "$(YELLOW)🖥️  Redis Commander: http://localhost:8081 (admin/secret)$(NC)"

dev: ## Démarre en mode développement avec rebuild
	@echo "$(BLUE)🔄 Mode développement...$(NC)"
	@docker-compose up --build

test: ## Teste la connexion aux services
	@echo "$(BLUE)🧪 Test des services...$(NC)"
	@echo "Test de l'API..."
	@curl -s http://localhost:3333 > /dev/null && echo "$(GREEN)✅ API OK$(NC)" || echo "$(YELLOW)⚠️  API non disponible$(NC)"
	@echo "Test de Redis..."
	@docker-compose exec redis redis-cli ping > /dev/null && echo "$(GREEN)✅ Redis OK$(NC)" || echo "$(YELLOW)⚠️  Redis non disponible$(NC)"

# Installation des dépendances locales
install: ## Installe les dépendances locales
	@echo "$(BLUE)📦 Installation des dépendances...$(NC)"
	@pnpm install
	@echo "$(GREEN)✅ Dépendances installées$(NC)"

# Commande par défaut
.DEFAULT_GOAL := help