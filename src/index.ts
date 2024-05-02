import path from "path";
import { ContentWriter, Context, ReportBase } from "istanbul-lib-report";
import { ReportNode, XmlWriter } from "istanbul-lib-report";

/*  Reference XSD format for Sonar
<xs:schema>
  <xs:element name="coverage">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="file" minOccurs="0" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="lineToCover" minOccurs="0" maxOccurs="unbounded">
                <xs:complexType>
                  <xs:attribute name="lineNumber" type="xs:positiveInteger" use="required"/>
                  <xs:attribute name="covered" type="xs:boolean" use="required"/>
                  <xs:attribute name="branchesToCover" type="xs:nonNegativeInteger"/>
                  <xs:attribute name="coveredBranches" type="xs:nonNegativeInteger"/>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          <xs:attribute name="path" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
      <xs:attribute name="version" type="xs:positiveInteger" use="required"/>
    </xs:complexType>
  </xs:element>
</xs:schema>

https://docs.sonarsource.com/sonarcloud/enriching/test-coverage/generic-test-data/
*/

interface LineCoverage {
  lineNumber: number;
  covered: boolean;
  coveredBranches?: number;
  branchesToCover?: number;
}
export = class SonarCodeCoverageReporter extends ReportBase {
  cw: ContentWriter | null;
  xml: XmlWriter | null;
  projectRoot: string;
  file: string;
  constructor(opts?: { projectRoot?: string; file?: string }) {
    super();

    opts = opts || {};

    this.cw = null;
    this.xml = null;
    this.projectRoot = opts.projectRoot || process.cwd();
    this.file = opts.file || "sonar-coverage.xml";
  }

  onStart(root: ReportNode, context: Context) {
    this.cw = context.writer.writeFile(this.file);
    // @ts-ignore
    this.xml = context.getXMLWriter(this.cw);
    this.writeRootStats(root);
    this.xml?.openTag("coverage", {
      version: "1",
    });
  }

  onEnd() {
    this.xml?.closeTag("coverage");
    this.xml?.closeAll();
    this.cw?.close();
  }

  writeRootStats(_node: ReportNode) {
    this.cw?.println('<?xml version="1.0" ?>');
  }

  onDetail(node: ReportNode) {
    const fileCoverage = node.getFileCoverage();
    const branchByLine = fileCoverage.getBranchCoverageByLine();

    this.xml?.openTag("file", {
      path: path.relative(this.projectRoot, fileCoverage.path)
    });

    const lines = fileCoverage.getLineCoverage();
    Object.entries(lines).forEach(([k, hits]) => {
      const attrs = {
        lineNumber: Number(k),
        covered: hits > 0
      } as LineCoverage;
      const branchDetail = branchByLine[Number(k)];

      if (branchDetail) {
        attrs["coveredBranches"] = branchDetail.covered;
        attrs["branchesToCover"] = branchDetail.total;
      }
      this.xml?.inlineTag("lineToCover", attrs);
    });

    this.xml?.closeTag("file");
  }
};
