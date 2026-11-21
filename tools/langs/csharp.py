from .base import Prepared

PROJECT = '''<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <LangVersion>12</LangVersion>
  </PropertyGroup>
</Project>
'''


def prepare(code, start_line):
    return Prepared('Program.cs', code, list(range(start_line, start_line + len(code.splitlines()))),
                    [['dotnet', 'build', 'console.csproj', '--nologo', '-o', 'out']], ['dotnet', 'out/console.dll'],
                    {'console.csproj': PROJECT, 'NuGet.Config': '<configuration><packageSources><clear /></packageSources></configuration>\n'})
