pipeline {
    agent any
    environment {
        PATH = "/opt/homebrew/bin:${env.PATH}"
    }
    stages {
        stage('Verificar Docker') {
            steps {
                sh '''
                    docker --version || echo "Docker no está disponible"
                '''
            }
        }

        stage('Parando los servicios...') {
            steps {
                sh ''' 
                    docker compose -p sgu || true
                '''
            }
        }

        stage('Eliminando las imágenes anteriores...') {
            steps {
                sh ''' 
                    IMAGES=$(docker images --filter "label=com.docker.compose.project=sgu" -q)
                    if [ -n "$IMAGES" ]; then
                        docker rmi -f $IMAGES
                    else
                        echo "No hay imágenes por eliminar"
                    fi
                '''
            }
        }

        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando servicios...') {
            steps {
                sh '''
                    docker compose up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
        }

        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }

        always {
            echo 'Pipeline finalizado'
        }
    }
}