﻿namespace WebDiet.Server.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }

        public string Email { get; set; }

        public DateTime CreationDate { get; set; }

        public string PasswordHash { get; set; }

        public ICollection<Menu> Menus { get; set; }

        public int RoleId { get; set; }
        public virtual Role Role { get; set; } 

    }
}
