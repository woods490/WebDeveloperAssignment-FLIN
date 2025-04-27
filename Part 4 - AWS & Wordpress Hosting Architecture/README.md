# System Architecture Explanation

The architecture for the WordPress site is presented [here](https://github.com/woods490/WebDeveloperAssignment-FLIN/blob/main/Part%204%20-%20AWS%20%26%20Wordpress%20Hosting%20Architecture/AWS%20WordPress%20Architecture.pdf)

## 1. Auto Scaling Group for WordPress Instances Running on EC2 with cPanel

![AutoScaleGroupAWS](./AutoScaleGroupAWS.png)

An **Auto Scaling Group (ASG)** manages multiple EC2 instances running **WordPress** with **cPanel** installed for simplified web hosting management.

The ASG automatically adjusts the number of EC2 instances based on traffic load:
- When demand increases, new instances are launched.
- When demand decreases, unnecessary instances are terminated.

This ensures **high availability**, **scalability**, and **fault tolerance**, keeping the WordPress site responsive even during heavy traffic spikes.

---

## 2. RDS with Master for Write and Slave for Read

![RDSInstances](./RDSInstances.png)

The database layer utilizes **Amazon RDS** with a **Master-Slave replication** configuration:
- The **Master RDS** instance handles all **write** operations (insert, update, delete).
- One or more **Slave RDS** instances handle **read** operations (select queries).

This separation improves **performance** and **scalability**, preventing heavy read traffic from impacting the write operations.

---

## 3. Amazon S3 Bucket for Static Assets (Public Access)

![AmazonS3BucketforStaticAssetinPublicAccess](./AmazonS3BucketforStaticAssetinPublic%20Access.png)

All static assets, such as images, CSS, JavaScript files, and other media, are stored in an **Amazon S3 bucket**.

The S3 bucket is configured for **public access**, allowing users to fetch these assets directly, which:
- Reduces the load on WordPress servers.
- Improves overall website performance by offloading static content delivery.

---

## 4. CloudFront for CDN Service

![CloudFrontForCDN](./CloudFrontForCDN.png)

**Amazon CloudFront** is used as a **Content Delivery Network (CDN)** to cache and deliver content from edge locations worldwide.

CloudFront fetches both dynamic and static content from the EC2 instances and S3 bucket, resulting in:
- **Faster website load times** for global visitors.
- **Reduced server load**.
- **Enhanced security** with built-in DDoS protection and encryption support.