provider "aws" {
  region = var.region
}

# Create an ECS Cluster
resource "aws_ecs_cluster" "pdf_cluster" {
  name = "pdf-cluster"
}

# Define the ECS Task Definition using your container settings
resource "aws_ecs_task_definition" "pdf_autograder" {
  family                   = "pdf-autograder"
  network_mode             = "bridge"  # For EC2 launch type; use "awsvpc" for Fargate
  requires_compatibilities = ["EC2"]
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = jsonencode([
    {
      name      = "pdf-autograder"
      image     = "376129853470.dkr.ecr.us-west-2.amazonaws.com/pdf-autograder:latest"
      memory    = 2048
      cpu       = 1024
      essential = true
      portMappings = [
        {
          containerPort = 8080
          protocol      = "tcp"
        },
      ]
      environment = [
        {
          name  = "GOOGLE_API_KEY"
          value = var.google_api_key
        },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/pdf-autograder"
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# Create an ECS Service to run the task on your cluster
resource "aws_ecs_service" "pdf_service" {
  name            = "pdf-autograder-service"
  cluster         = aws_ecs_cluster.pdf_cluster.id
  task_definition = aws_ecs_task_definition.pdf_autograder.arn
  desired_count   = 1
  launch_type     = "EC2"

  # Optionally, you can add load balancer configuration and other settings here
}