/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer;

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
public class GamerTest {
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        try {
            Class.forName("StarGrazer.Gamer");
            Gamer.s_databasePath = "gamertest.db";
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(GamerTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @After
    public void tearDown() {
        // delete database
        java.io.File databaseFile = new java.io.File(Gamer.s_databasePath);
        boolean deleted = databaseFile.delete();
        System.out.println("StarGrazer.GamerTest.tearDown() " + deleted);

    }

    //
    @Test
    public void empty() {
        System.out.println("StarGrazer.GamerTest.empty()");
        // empty database
        assertEquals(0, Gamer.retrieve().size());
        assertEquals(null, Gamer.retrieve("dummyName"));
    }
    @Test
    public void one() {
        System.out.println("StarGrazer.GamerTest.one()");
        // empty database
        Gamer g = new Gamer("a", "b");
        g.persist();
        assertEquals(1, Gamer.retrieve().size());
        assertEquals(null, Gamer.retrieve("dummyName"));
        assertEquals(g.userName(), Gamer.retrieve("a").userName());
    }
    @Test
    public void update() {
        System.out.println("StarGrazer.GamerTest.update()");
        // empty database
        Gamer g = new Gamer("a", "b");
        g.persist();
        Gamer g2 = new Gamer("a", "c");
        g2.persist();
        assertEquals(1, Gamer.retrieve().size());
        assertEquals(g2.userName(), Gamer.retrieve("a").userName());
        assertEquals(g2.gamerName(), Gamer.retrieve("a").gamerName());
    }
}
