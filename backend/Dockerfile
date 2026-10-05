# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["BusinessManager.Api.csproj", "./"]
RUN dotnet restore "BusinessManager.Api.csproj"
COPY . .
RUN dotnet publish "BusinessManager.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5058
EXPOSE 5058
ENTRYPOINT ["dotnet", "BusinessManager.Api.dll"]
