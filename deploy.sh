#!/bin/bash

# Menu Customer Frontend Deployment Script
# This script automates the deployment process for the Menu Customer application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "======================================"
    echo "$1"
    echo "======================================"
    echo -e "${NC}"
}

# Check if Docker is installed
check_docker() {
    print_info "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed: $(docker --version)"
}

# Check if Docker Compose is installed
check_docker_compose() {
    print_info "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed: $(docker-compose --version)"
}

# Stop existing containers
stop_containers() {
    print_info "Stopping existing containers..."
    if docker-compose ps -q | grep -q .; then
        docker-compose down
        print_success "Existing containers stopped"
    else
        print_info "No containers to stop"
    fi
}

# Build Docker image
build_image() {
    print_info "Building Docker image..."
    docker-compose build --no-cache
    print_success "Docker image built successfully"
}

# Start containers
start_containers() {
    print_info "Starting containers..."
    docker-compose up -d
    print_success "Containers started successfully"
}

# Wait for container to be healthy
wait_for_health() {
    print_info "Waiting for container to be healthy..."

    max_attempts=30
    attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if docker inspect menu-customer-app --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
            print_success "Container is healthy!"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    print_warning "Health check timeout. Container may still be starting..."
    return 1
}

# Show container status
show_status() {
    print_info "Container status:"
    docker-compose ps
}

# Show logs
show_logs() {
    print_info "Recent logs:"
    docker-compose logs --tail=50
}

# Test application
test_application() {
    print_info "Testing application..."

    sleep 5  # Wait a bit for the app to fully start

    if curl -f http://localhost:4002 > /dev/null 2>&1; then
        print_success "Application is responding on port 4002"
    else
        print_warning "Application may not be responding yet. Check logs with: docker-compose logs -f"
    fi
}

# Cleanup old images
cleanup() {
    print_info "Cleaning up old images..."
    docker image prune -f
    print_success "Cleanup completed"
}

# Main deployment function
deploy() {
    print_header "🚀 Menu Customer Frontend Deployment"

    check_docker
    check_docker_compose
    stop_containers
    build_image
    start_containers

    echo ""
    wait_for_health

    echo ""
    show_status

    echo ""
    test_application

    echo ""
    print_header "✨ Deployment Complete!"

    echo ""
    print_info "Access the application at:"
    echo -e "  ${GREEN}http://localhost:4002${NC}"
    echo -e "  ${GREEN}http://$(hostname -I | awk '{print $1}'):4002${NC}"

    echo ""
    print_info "Useful commands:"
    echo "  View logs:       docker-compose logs -f"
    echo "  Stop app:        docker-compose down"
    echo "  Restart app:     docker-compose restart"
    echo "  View status:     docker-compose ps"

    echo ""
}

# Rollback function
rollback() {
    print_header "🔄 Rolling Back Deployment"

    print_info "Stopping current containers..."
    docker-compose down

    print_success "Rollback completed. Restore from backup if needed."
}

# Update function
update() {
    print_header "🔄 Updating Application"

    print_info "Pulling latest changes..."
    if [ -d .git ]; then
        git pull
        print_success "Code updated"
    else
        print_warning "Not a git repository. Skipping pull."
    fi

    deploy
}

# Menu
show_menu() {
    echo ""
    print_header "Menu Customer Deployment Script"
    echo "1) Deploy application"
    echo "2) Update and redeploy"
    echo "3) Stop application"
    echo "4) Restart application"
    echo "5) View logs"
    echo "6) View status"
    echo "7) Cleanup unused images"
    echo "8) Rollback"
    echo "9) Exit"
    echo ""
    read -p "Choose an option: " choice

    case $choice in
        1) deploy ;;
        2) update ;;
        3) stop_containers ;;
        4) docker-compose restart && show_status ;;
        5) docker-compose logs -f ;;
        6) show_status ;;
        7) cleanup ;;
        8) rollback ;;
        9) exit 0 ;;
        *) print_error "Invalid option" && show_menu ;;
    esac
}

# Parse command line arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case "$1" in
        deploy)
            deploy
            ;;
        update)
            update
            ;;
        stop)
            stop_containers
            ;;
        restart)
            docker-compose restart
            show_status
            ;;
        logs)
            docker-compose logs -f
            ;;
        status)
            show_status
            ;;
        cleanup)
            cleanup
            ;;
        rollback)
            rollback
            ;;
        *)
            echo "Usage: $0 {deploy|update|stop|restart|logs|status|cleanup|rollback}"
            exit 1
            ;;
    esac
fi
