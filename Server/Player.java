package stargrazer.server;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;

// Notice, do not import com.mysql.cj.jdbc.*
// or you will have problems!

public class Player {
    static void printHelp() {
            System.out.println("Usage: Player <username> <Game name>");
    }

    private static final String DATABASE_PATH = "./data/Players.db";
    public void persist() {
        final java.io.File databaseFile = new java.io.File(DATABASE_PATH);
        if (!databaseFile.exists()) {
            // create database
        }
    }

    private final String m_userName;
    private final String m_gameName;
    public Player(String userName, String gameName) {
        m_userName = userName;
        m_gameName = gameName;
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            printHelp();
            System.exit(1);
        }
        Player player = new Player(args[0], args[1]);
        player.persist();
		// sign up
		// create player
		//if database does not exist
		//   create database
		// put player in database
		Connection conn = null;
		try {
			Class.forName("org.sqlite.JDBC");
			// db parameters
			String url = "jdbc:sqlite:chinook.db";
			// create a connection to the database
			conn = DriverManager.getConnection(url);
			
			System.out.println("Connection to SQLite has been established.");
			
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		} catch (ClassNotFoundException e) {
			System.out.println("ClassNotFoundException" + e.getMessage());
		} finally {
			try {
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException ex) {
				System.out.println(ex.getMessage());
			}
		}
		Statement stmt = null;
		ResultSet rs = null;
	}
}
