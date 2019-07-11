package stargrazer.database;

import stargrazer.database.ConnectionUtility;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

/**
 *
 * A player is a gamer participant in a game-instance.
 */
public class DBSession {
    private static final String DATABASE_PATH = "/release/db/Sessions.db";
    public static String s_databasePath = DATABASE_PATH;
    public static String s_noSession = "No session";;
    
    public static String startGame(String userName) {
        String session = s_noSession;
        ConnectionUtility conn = ConnectionUtility.createOrOpenDatabase(s_databasePath);
        if (conn != null) {
            try {
                // Todo: create unique user name
                session = userName;
                conn.execute("CREATE TABLE IF NOT EXISTS Sessions (\n"
                + "	session text PRIMARY KEY,\n"
                + "	username text NOT NULL\n"
                + ");");
                String sql = "INSERT OR REPLACE INTO Sessions(session, username) VALUES(?,?)";
                PreparedStatement pstmt = conn.m_conn.prepareStatement(sql);
                pstmt.setString(1, session);
                pstmt.setString(2, userName);
                pstmt.executeUpdate();
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
                session = s_noSession;
            }
            conn.close();
        }
        return session;
    }
    
    public static String stopGame(String session) {
        ConnectionUtility conn = ConnectionUtility.createOrOpenDatabase(s_databasePath);
        if (conn != null) {
            try {
                // Todo: create unique user name
                String sql = "DELETE FROM Gamers WHERE username = ?";
                PreparedStatement pstmt = conn.m_conn.prepareStatement(sql);
                pstmt.setString(1, session);
                pstmt.executeUpdate();
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
                session = s_noSession;
            }
            conn.close();
        }
        return session;
    }
}
