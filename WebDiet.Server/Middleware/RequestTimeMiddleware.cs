
using System.Diagnostics;

namespace WebDiet.Server.Middleware
{
    public class RequestTimeMiddleware : IMiddleware
    {
        private Stopwatch _stopwatch;
        private ILogger<RequestTimeMiddleware> _logger;
        public RequestTimeMiddleware(ILogger<RequestTimeMiddleware> logger)
        {
            _stopwatch = new Stopwatch();
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            _stopwatch.Start();
           await next.Invoke(context);
            _stopwatch?.Stop();

            var time = _stopwatch.ElapsedMilliseconds;
            if(time/1000 > 4)
            {
                var message = $"Request [{context.Request.Method}] at {context.Request.Path} took {time} ms.";

                _logger.LogInformation(message);

            }
        }
    }
}
