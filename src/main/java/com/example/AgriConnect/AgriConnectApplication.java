package com.example.AgriConnect;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class AgriConnectApplication {

	public static void main(String[] args) {

		// Load .env (if present — e.g. local dev) into system properties so
		// application.properties' ${VAR_NAME} placeholders resolve. In
		// production, set these as real environment variables instead of
		// shipping a .env file, and both loaders below are no-ops if
		// nothing is found.
		//
		// Two loaders, not one: dotenv-java's Dotenv.load() only looks in
		// the JVM's working directory, which IDEs don't reliably set to
		// the project root (e.g. IntelliJ can launch with the working
		// directory one level up, if the project sits in a nested folder
		// like .../AgriConnect/AgriConnect/) — so a project-root .env can
		// silently go unfound with no error, just a placeholder resolution
		// failure much later at bean-creation time. Loading the copy on
		// the classpath (src/main/resources/.env) sidesteps that entirely,
		// since the classpath doesn't depend on the working directory.
		loadDotenvFromWorkingDirectory();
		loadDotenvFromClasspath();

		SpringApplication.run(AgriConnectApplication.class, args);
	}

	private static void loadDotenvFromWorkingDirectory() {
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);
	}

	private static void loadDotenvFromClasspath() {
		try (InputStream in = AgriConnectApplication.class.getClassLoader().getResourceAsStream(".env")) {

			if (in == null) {
				return;
			}

			try (BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
				String line;
				while ((line = reader.readLine()) != null) {
					String trimmed = line.trim();

					if (trimmed.isEmpty() || trimmed.startsWith("#")) {
						continue;
					}

					int eq = trimmed.indexOf('=');
					if (eq <= 0) {
						continue;
					}

					String key = trimmed.substring(0, eq).trim();
					String value = trimmed.substring(eq + 1).trim();

					// Strip a single layer of surrounding quotes, if present
					// (common in .env files), same as dotenv-java does.
					if (value.length() >= 2
							&& ((value.startsWith("\"") && value.endsWith("\""))
							|| (value.startsWith("'") && value.endsWith("'")))) {
						value = value.substring(1, value.length() - 1);
					}

					// Don't clobber a value the working-directory loader
					// (or a real OS environment variable already promoted
					// to a System property) already supplied.
					if (System.getProperty(key) == null) {
						System.setProperty(key, value);
					}
				}
			}

		} catch (IOException e) {
			// Best-effort — if the classpath .env can't be read, fall back
			// entirely to the working-directory loader and real env vars.
		}
	}
}