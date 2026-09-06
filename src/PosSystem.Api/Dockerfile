#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/PosSystem.Api/PosSystem.Api.csproj", "src/PosSystem.Api/"]
COPY ["src/PosSystem.Application/PosSystem.Application.csproj", "src/PosSystem.Application/"]
COPY ["src/PosSystem.Domain/PosSystem.Domain.csproj", "src/PosSystem.Domain/"]
COPY ["src/PosSystem.Infrastructure/PosSystem.Infrastructure.csproj", "src/PosSystem.Infrastructure/"]
RUN dotnet restore "./src/PosSystem.Api/PosSystem.Api.csproj"
COPY . .
WORKDIR "/src/src/PosSystem.Api"
RUN dotnet build "./PosSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PosSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PosSystem.Api.dll"]