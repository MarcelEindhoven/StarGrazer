import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;

// Notice, do not import com.mysql.cj.jdbc.*
// or you will have problems!

public class MySQL {
    public static void main(String[] args) {
    String jdbcUrl = "jdbc:mysql://localhost:3306";
    String username = "StarGrazer";
    String password = "StarGrazer";

    Connection conn = null;
    Statement stmt = null;
    ResultSet rs = null;
        try {
            // The newInstance() call is a work around for some
            // broken Java implementations

            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
      // Step 2 - Open connection
      conn = DriverManager.getConnection(jdbcUrl, username, password);
	  System.out.println("Connected");
        } catch (Exception ex) {
            // handle the error
	  System.out.println("Not Connected");
            ex.printStackTrace();
        }
    }
}
