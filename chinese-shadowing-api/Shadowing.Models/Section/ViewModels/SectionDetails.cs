namespace Shadowing.Models.Section.ViewModels
{
    public class SectionDetails
    {
        public string Id { get; set; }
        public double Start { get; set; }
        public double End { get; set; }
        public string AudioUrl { get; set; }
        public string Text { get; set; }
        public Persona.ViewModels.Persona Persona { get; set; }
    }
}
