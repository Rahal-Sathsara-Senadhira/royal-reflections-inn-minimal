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
                  # Stop & remove previous containers/networks/volumes created by this compose project
                  docker compose down --remove-orphans || true

                  # Start again in detached mode (uses the images built in the Build stage)
                  docker compose up -d

                  # Show running containers (useful for evidence/screenshots)
                  docker ps
                '''
            }
        }
    }
}
