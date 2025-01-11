pipeline {
    agent any
    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-artifact-key')
    }
    stages {
        stage('Verify GCP Auth') {
            steps {
                sh '''
                    gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
                    gcloud artifacts repositories list
                '''
            }
        }
    }
}