namespace WebDiet.Server.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }

        public ICollection<Menu> Menus { get; set; }

    }
}
