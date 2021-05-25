# See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 443
SHELL ["/bin/bash", "-c"]

RUN apt-get update -y \
    && apt-get install -y \
        python3-pip \
        ffmpeg \
        libgdiplus

RUN pip3 install --upgrade pip \
    && pip3 install spleeter

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Shadowing.API/Shadowing.API.csproj", "Shadowing.API/"]
COPY ["Shadowing.Business/Shadowing.Business.csproj", "Shadowing.Business/"]
COPY ["Shadowing.DataAccess/Shadowing.DataAccess.csproj", "Shadowing.DataAccess/"]
COPY ["Shadowing.Models/Shadowing.Models.csproj", "Shadowing.Models/"]
RUN dotnet restore "Shadowing.API/Shadowing.API.csproj"
COPY . .
WORKDIR "/src/Shadowing.API"
RUN dotnet build "Shadowing.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Shadowing.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Shadowing.API.dll"]
