import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;

// Notice, do not import com.mysql.cj.jdbc.*
// or you will have problems!

public class SQLLite {
    public static void main(String[] args) {
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
