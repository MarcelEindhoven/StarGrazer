/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer.database;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Gebruiker
 */
public class DBGamerTest {
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
            DBGamer.s_databasePath = "gamertest.db";
    }
    
    @After
    public void tearDown() {
        DBGamer.clear();
    }

    //
    @Test
    public void empty() {
        System.out.println("stargrazer.GamerTest.empty()");
        // empty database
        assertEquals(0, DBGamer.retrieve().size());
        assertEquals(null, DBGamer.retrieve("dummyName"));
    }
    @Test
    public void one() {
        System.out.println("stargrazer.GamerTest.one()");
        // empty database
        DBGamer g = new DBGamer("a", "b");
        g.persist();
        assertEquals(1, DBGamer.retrieve().size());
        assertEquals(null, DBGamer.retrieve("dummyName"));
        assertEquals(g.userName(), DBGamer.retrieve("a").userName());
    }
    @Test
    public void update() {
        System.out.println("stargrazer.GamerTest.update()");
        // empty database
        DBGamer g = new DBGamer("a", "b");
        g.persist();
        DBGamer g2 = new DBGamer("a", "c");
        g2.persist();
        assertEquals(1, DBGamer.retrieve().size());
        assertEquals(g2.userName(), DBGamer.retrieve("a").userName());
        assertEquals(g2.gamerName(), DBGamer.retrieve("a").gamerName());
    }
}
