/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer.rest;

@javax.ws.rs.Path("Gamer/{username}")
public class RESTGamer {
    private String message = new String("Hello, ");
    
    // The Java method will process HTTP GET requests
    @javax.ws.rs.GET
    // The Java method will produce content identified by the MIME Media
    // type "text/plain"
    @javax.ws.rs.Produces("text/plain")
    public String signIn(@javax.ws.rs.PathParam("username") String userName) {
        return message + userName + ".";
    }
    @javax.ws.rs.POST
    // The Java method will produce content identified by the MIME Media
    // type "text/plain"
    @javax.ws.rs.Consumes("text/plain")
    public void signUp(@javax.ws.rs.PathParam("username") String userName, String gamerName) {
        ;
    }
}
