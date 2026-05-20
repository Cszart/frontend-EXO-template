/**
 * A simple logger utility for logging messages with different log levels.
 *
 * @param {string} identifier - The identifier for the logger.
 * @example
 * const logger = new Logger({ identifier: "Example" });
 * logger.info("example info");
 */

interface LoggerConfig {
	identifier: string;
}

class Logger {
	private identifier: string;

	/**
	 * Creates a new Logger with the specified identifier.
	 * @param {string} identifier - The identifier for the logger.
	 */
	constructor({ identifier }: LoggerConfig) {
		this.identifier = identifier;
	}

	/**
	 * Logs an info message with the specified arguments.
	 * @param  {...any} args - The arguments to be logged.
	 * @returns {void}
	 */
	info(...args: any[]): void {
		console.log(`<- [INFO] ${this.identifier} :`, ...args);
	}

	/**
	 * Logs a warning message with the specified arguments.
	 * @param  {...any} args - The arguments to be logged.
	 * @returns {void}
	 */
	warning(...args: any[]): void {
		console.log(`<- [WARNING] ${this.identifier} :`, ...args);
	}

	/**
	 * Logs an error message with the specified arguments.
	 * @param  {...any} args - The arguments to be logged.
	 * @returns {void}
	 */
	error(...args: any[]): void {
		console.log(`<- [ERROR] ${this.identifier} :`, ...args);
	}
}

export default Logger;
export { Logger };
