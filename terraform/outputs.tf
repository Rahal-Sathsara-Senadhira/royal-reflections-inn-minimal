output "public_ip" {
  value       = aws_instance.rri_ec2.public_ip
  description = "Public IP of the EC2 instance"
}

output "public_dns" {
  value       = aws_instance.rri_ec2.public_dns
  description = "Public DNS of the EC2 instance"
}

output "jenkins_url" {
  value       = "http://${aws_instance.rri_ec2.public_ip}:8080"
  description = "Jenkins URL"
}
