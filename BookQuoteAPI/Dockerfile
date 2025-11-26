# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# Expose port (Render will assign the actual port)
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:$PORT

# Run the application
ENTRYPOINT ["dotnet", "BookQuoteAPI.dll"]