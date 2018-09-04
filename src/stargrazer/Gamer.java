package stargrazer;

import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

// Notice, do not import com.mysql.cj.jdbc.*
// or you will have problems!

public class Gamer {
    private final String m_userName;
    private final String m_gamerName;

    private static final String DATABASE_PATH = "./data/Players.db";
    public static String s_databasePath = DATABASE_PATH;

    public static void printHelp() {
            System.out.println("Usage: Player <username> <Game name>");
    }

    public static ArrayList<String> retrieve() {
        // all usernames in the database
        ArrayList<String> userNames = new ArrayList<>();
        ConnectionUtility conn = ConnectionUtility.createOrOpenDatabase(s_databasePath);
        if (conn != null) {
            try {
                String sql = "SELECT username, gamername FROM gamers";
                Statement stmt  = conn.m_conn.createStatement();
                ResultSet rs    = stmt.executeQuery(sql);
                while (rs.next()) {
                    userNames.add(rs.getString("username"));
                    System.out.println("retrieve" + rs.getString("username") + "\t" +
                                       rs.getString("gamername"));
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
            conn.close();
        }
        return userNames;
    }

    public static Gamer retrieve(String username) {
        // retrieve from database
        Gamer gamer = null;
        ConnectionUtility conn = ConnectionUtility.createOrOpenDatabase(s_databasePath);
            if (conn != null) {
        try {
                String sql = "SELECT username, gamername FROM gamers WHERE username = ?";
                PreparedStatement pstmt  = conn.m_conn.prepareStatement(sql);
                pstmt.setString(1, username);
                ResultSet rs    = pstmt.executeQuery();
                while (rs.next()) {
                    gamer = new Gamer(rs.getString("username"), rs.getString("gamername"));
                    System.out.println("retrieve(" + rs.getString("username") + ") " +
                                       rs.getString("gamername"));
                }

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
                conn.close();
            }
        return gamer;
    }

    public void persist() {
        ConnectionUtility conn = ConnectionUtility.createOrOpenDatabase(s_databasePath);
        if (conn != null) {
            try {
                conn.createTabeIfNeeded("CREATE TABLE IF NOT EXISTS gamers (\n"
                + "	username text PRIMARY KEY,\n"
                + "	gamername text NOT NULL\n"
                + ");");
                String sql = "INSERT OR REPLACE INTO Gamers(username,gamername) VALUES(?,?)";
                PreparedStatement pstmt = conn.m_conn.prepareStatement(sql);
                pstmt.setString(1, m_userName);
                pstmt.setString(2, m_gamerName);
                pstmt.executeUpdate();
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
            conn.close();
        }
    }

    public Gamer(String userName, String gameName) {
        m_userName = userName;
        m_gamerName = gameName;
    }

    /**
     * @return the m_userName
     */
    public String userName() {
        return m_userName;
    }

    /**
     * @return the m_gamerName
     */
    public String gamerName() {
        return m_gamerName;
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            printHelp();
        } else {
            Gamer player = new Gamer(args[0], args[1]);
            player.persist();
	}
    }
}
