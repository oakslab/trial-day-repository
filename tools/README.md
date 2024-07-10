# Tools

Tools folder is there to help you to develop your project. It contains a few scripts that you can use to help you to develop your project.

## DB Url Replace

This will replace your `DATABASE_URL` in your '.env' files that is suppose to be
for GCP Cloud SQL. Replaced URL will be the one you can use to connect with
SQL Proxy.

Example:

```
DATABASE_URL="postgresql://username:password@localhost/application-id?host=/cloudsql/application-id:region-id:sql-instance-name&connection_limit=25"

// will be updated to

DATABASE_URL="postgresql://username:password@localhost:5433/instance-name?connection_limit=25"
```
