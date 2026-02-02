pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                  docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  echo "Stopping old containers (if any)..."
                  docker rm -f db_c backend_c frontend_c 2>/dev/null || true

                  echo "Bringing stack down (safe)..."
                  docker compose down --remove-orphans || true

                  echo "Starting new containers..."
                  docker compose up -d

                  echo "Running containers:"
                  docker ps
                '''
            }
        }
    }
}
