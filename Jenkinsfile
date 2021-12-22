@Library('ceiba-jenkins-library') _
pipeline{
	
		agent {
		label 'Slave_Induccion'
		}
	
        
		triggers {
        pollSCM('@hourly')
		}
	
		options {
			buildDiscarder(logRotator(numToKeepStr: '3'))
			disableConcurrentBuilds()
		}
		
		stages{
		
			stage('Checkout') {
				steps {
                echo '------------>Checkout desde Git Microservicio<------------'
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], gitTool: 'Default' , submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'GitHub_julianaflorezm', url: 'https://github.com/julianaflorezm/node-nestjs-arquitectura-hexagonal']]])
				}
			}
		
		
			stage('NPM Install') {
				steps {
					echo "------------>Installing<------------"
					sh 'npm install'
				}
			}

			stage('Unit Test') {
				steps {
					echo "------------>Testing<------------"
					sh 'npm run test'
				}
			}
			stage('Test end-to-end') {
				steps{
					echo "------------>Testing Protractor<------------"
					sh 'npm run e2e'
				}
			}

			stage('Static Code Analysis') {
				steps{
					sonarqubeMasQualityGatesP(sonarKey:'co.com.ceiba.adn:[banco-juliana.florez]', 
					sonarName:'CeibaADN-Banco(juliana.florez)', 
					sonarPathProperties:'./sonar-project.properties')
				}
			}
		
			stage('Build') {
				steps {
					echo "------------>Building<------------"
					sh 'npm run build'
				}
			}
			
		}
		post {
			failure {
				mail(to: 'juliana.florez@ceiba.com.co',
				body:"Build failed in Jenkins: Project: ${env.JOB_NAME} Build /n Number: ${env.BUILD_NUMBER} URL de build: ${env.BUILD_NUMBER}/n/nPlease go to ${env.BUILD_URL} and verify the build",
				subject: "ERROR CI: ${env.JOB_NAME}")
			}
			success {
				echo 'This will run only if successful'
				junit 'build/test-results/test/*.xml' //RUTA RELATIVA DE LOS ARCHIVOS .XML
			}
		}	
			
}