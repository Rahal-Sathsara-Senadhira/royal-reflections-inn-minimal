pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build & Deploy') {
      steps {
        sh '''
          docker-compose down || true
          docker-compose build --no-cache
          docker-compose up -d
          docker ps
        '''
      }
    }
  }

  post {
    always {
      sh 'docker-compose ps || true'
    }
    failure {
      sh 'docker-compose logs --tail=200 || true'
    }
  }
}
