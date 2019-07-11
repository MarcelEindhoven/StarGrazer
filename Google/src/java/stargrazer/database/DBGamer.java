package stargrazer.database;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Precondition;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.util.concurrent.MoreExecutors;
import stargrazer.database.ConnectionUtility;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

// Notice, do not import com.mysql.cj.jdbc.*
// or you will have problems!

public class DBGamer {
    private final String m_userName;
    private final String m_gamerName;

    private static final String DATABASE_PATH = "/release/db/Players.db";
    public static String s_databasePath = DATABASE_PATH;

    public static void printHelp() {
        System.out.println("Usage: Player <username> <Game name>");
    }

    public static void clear() {
        try {
            com.google.cloud.firestore.FirestoreOptions options = com.google.cloud.firestore.FirestoreOptions.getDefaultInstance();
            com.google.cloud.firestore.Firestore db = options.getService();
            CollectionReference collection = db.collection("Gamers");
            ApiFuture<QuerySnapshot> snapshot = collection.get();
            QuerySnapshot q = snapshot.get();
            q.getDocuments().forEach((doc) -> {try {
                doc.getReference().delete().wait();
            } catch (InterruptedException ex) {
                Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
            }
            });     } catch (InterruptedException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ExecutionException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static ArrayList<String> retrieve() {
        // all usernames in the database
        ArrayList<String> userNames = new ArrayList<>();
        try {
            com.google.cloud.firestore.Firestore db = com.google.cloud.firestore.FirestoreOptions.getDefaultInstance().getService();
            ApiFuture<QuerySnapshot> snapshot = db.collection("Gamers").get();
            QuerySnapshot q = snapshot.get();
            for (Iterator<com.google.cloud.firestore.QueryDocumentSnapshot> docIt = q.iterator();docIt.hasNext();) {
                String userName = docIt.next().getString("userName");
                userNames.add(userName);
            }
        } catch (InterruptedException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ExecutionException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return userNames;
    }

    public static DBGamer retrieve(String username) {
        // retrieve from database
        com.google.cloud.firestore.Firestore db = com.google.cloud.firestore.FirestoreOptions.getDefaultInstance().getService();
        DBGamer gamer = null;
        ApiFuture<com.google.cloud.firestore.DocumentSnapshot> snapshot = db.collection("Gamers").document(username).get();
        try {
            String gamerName = snapshot.get().getString("gamerName");
            gamer = new DBGamer(username, gamerName);
        } catch (InterruptedException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ExecutionException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return gamer;
    }

    public void persist() {
        com.google.cloud.firestore.Firestore db = com.google.cloud.firestore.FirestoreOptions.getDefaultInstance().getService();
        Map<String, Object> map = new HashMap<>();
        map.put("gamerName", m_gamerName);
        ApiFuture<WriteResult> snapshot = db.collection("Gamers").document(m_userName).set(map);
        try {
            snapshot.get();
        } catch (InterruptedException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ExecutionException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void delete() {
        com.google.cloud.firestore.Firestore db = com.google.cloud.firestore.FirestoreOptions.getDefaultInstance().getService();
        ApiFuture<com.google.cloud.firestore.WriteResult> snapshot = db.collection("Gamers").document(m_userName).delete(Precondition.NONE);
        try {
            snapshot.wait();
        } catch (InterruptedException ex) {
            Logger.getLogger(DBGamer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public DBGamer(String userName, String gamerName) {
        m_userName = userName;
        m_gamerName = gamerName;
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
            System.out.println("Gamers : "+ retrieve());
        } else {
            DBGamer player = new DBGamer(args[0], args[1]);
            player.persist();
	}
    }
}
