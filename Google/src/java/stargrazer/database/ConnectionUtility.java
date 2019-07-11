/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer.database;

import java.sql.SQLException;
import java.sql.DriverManager;
import java.sql.Statement;

/**
 *
 * @author Gebruiker
 */
public class ConnectionUtility {
    public java.sql.Connection m_conn;

    public static ConnectionUtility createOrOpenDatabase(String s_databasePath) {
        ConnectionUtility conn = new ConnectionUtility();
        // all usernames in the database
        try {
                Class.forName("com.mysql.jdbc.Driver");
                // db parameters
                String url = "jdbc:mysql://fdb23.biz.nf:3306/2898075_stargrazer";
                // create a connection to the database
                conn.m_conn = DriverManager.getConnection(url, "2898075_stargrazer", "StarGrazer_0");

                System.out.println("Connection to SQLite has been established.");

        } catch (SQLException e) {
                System.out.println(e.getMessage());
                conn = null;
        } catch (ClassNotFoundException e) {
                System.out.println("ClassNotFoundException" + e.getMessage());
                conn = null;
        }
        return conn;
    }

    public ConnectionUtility() {
        this.m_conn = null;
    }
    
    public void close() {
        try {
            m_conn.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
    }

    public void execute(String sql) {
        // all usernames in the database
        // SQL statement for creating a new table
        try {
            Statement stmt = m_conn.createStatement();
            // create a new table
            stmt.execute(sql);
        } catch (SQLException e) {
                System.out.println(e.getMessage());
        }
    }
}
