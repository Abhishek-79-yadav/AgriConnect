package com.example.AgriConnect;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AgriConnectApplication {

	public static void main(String[] args) {

		// Load .env (if present — e.g. local dev) into system properties so
		// application.properties' ${VAR_NAME} placeholders resolve. In
		// production, set these as real environment variables instead of
		// shipping a .env file, and this call is a no-op if none is found.
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(AgriConnectApplication.class, args);
	}
}