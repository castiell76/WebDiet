using Microsoft.AspNetCore.Authorization;

namespace WebDiet.Server.Authorization
{
    public enum ResourceOperation
    {
        Create,
        Update,
        Delete,
        Read
    }
    public class ResourceOperationRequirement : IAuthorizationRequirement
    {
        public ResourceOperationRequirement(ResourceOperation resourceOperation)
        {
            resourceOperation = ResourceOperation;
        }

        public ResourceOperation ResourceOperation { get; }
    }
}
