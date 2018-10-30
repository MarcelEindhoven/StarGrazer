/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer.rest;

import stargrazer.database.DBGamer;

@javax.ws.rs.Path("Gamer/{username}")
public class RESTGamer {
    private String message = new String("Hello, ");
    
    // The Java method will process HTTP GET requests
    @javax.ws.rs.GET
    // The Java method will produce content identified by the MIME Media
    // type "text/plain"
    @javax.ws.rs.Produces("text/plain")
    public String signIn(@javax.ws.rs.PathParam("username") String userName) {
        DBGamer g = DBGamer.retrieve(userName);
        if (null != g) {
            return g.gamerName();
        } else {
            return "Unknown user";
        }
    }
    @javax.ws.rs.POST
    // The Java method will produce content identified by the MIME Media
    // type "text/plain"
    @javax.ws.rs.Consumes("text/plain")
    public String signUp(@javax.ws.rs.PathParam("username") String userName, String gamerName) {
        DBGamer g = new DBGamer(userName, gamerName);
        g.persist();
        return gamerName;
    }
}
